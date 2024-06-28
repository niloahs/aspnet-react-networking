using Application.Core;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles;

public class ListActivities
{
    public class Query : IRequest<Result<List<UserActivityDto>>>
    {
        public string Username { get; set; }
        public string Predicate { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<List<UserActivityDto>>>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public Handler(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }


        public async Task<Result<List<UserActivityDto>>> Handle(Query request,
            CancellationToken cancellationToken)
        {
            var user = await _context.Users
                .Include(x => x.Activities)
                .ThenInclude(a => a.Activity)
                .FirstOrDefaultAsync(x => x.UserName == request.Username,
                    cancellationToken: cancellationToken);

            if (user == null)
            {
                return null;
            }

            var activities = _context.ActivityAttendees
                .Where(a => a.AppUser.UserName == request.Username)
                .OrderBy(a => a.Activity.Date)
                .AsQueryable();

            activities = request.Predicate switch
            {
                "past" => activities.Where(a => a.Activity.Date <= DateTime.UtcNow),
                "hosting" => activities.Where(a => a.IsHost),
                _ => activities.Where(a => a.Activity.Date >= DateTime.UtcNow)
            };

            var activitiesToReturn = await activities.ToListAsync(cancellationToken);

            return Result<List<UserActivityDto>>.Success(
                _mapper.Map<List<UserActivityDto>>(activitiesToReturn));
        }
    }
}