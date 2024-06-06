using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities;

public class Edit
{
    public class Command : IRequest
    {
        public Activity Activity { get; set; }
    }
    
    public class Handler : IRequestHandler<Command>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        
        public Handler(DataContext content, IMapper mapper)
        {
            _mapper = mapper;
            _context = content;
        }
        
        public async Task Handle(Command request, CancellationToken cancellationToken)
        {
            var activity = await _context.Activities.FindAsync(request.Activity.Id);
            
            if (activity == null) return;

            _mapper.Map(request.Activity, activity);
            
            await _context.SaveChangesAsync();
        }
    }
}