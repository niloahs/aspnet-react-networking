using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles;

public class EditProfile
{
    public class Command : IRequest<Result<Unit>>
    {
        public string DisplayName { get; set; }
        public string Bio { get; set; }
    }

    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;

        public Handler(DataContext context, IUserAccessor userAccessor)
        {
            _context = context;
            _userAccessor = userAccessor;
        }

        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var user =
                await _context.Users.FirstOrDefaultAsync(x =>
                        x.UserName == _userAccessor.GetUsername(),
                    cancellationToken: cancellationToken);

            if (user == null)
            {
                return null;
            }

            user.DisplayName = request.DisplayName ?? user.DisplayName;

            user.Bio = request.Bio ?? user.Bio;

            if (user.UserName != _userAccessor.GetUsername())
            {
                return Result<Unit>.Failure("You are not authorized to edit this profile");
            }

            var success = await _context.SaveChangesAsync(cancellationToken) > 0;

            return success
                ? Result<Unit>.Success(Unit.Value)
                : Result<Unit>.Failure("Failed to update profile");
        }
    }
}