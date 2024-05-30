using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers;

public class ActivitiesController : BaseApiController
{

    private readonly DataContext _context;

    public ActivitiesController(DataContext context)
    {
        _context = context;
    }

    [HttpGet] //api/activities
    public async Task<ActionResult<List<Activity>>> GetActivities()
    {
        return await _context.Activities.ToListAsync();
    }
    
    [HttpGet("{id:guid}")] //api/activities/id
    public async Task<ActionResult<Activity>> GetActivity(Guid id)
    {
        return await _context.Activities.FindAsync(id);
    }
    
    [HttpPost]
    public async Task CreateActivity(Activity activity)
    {
        _context.Activities.Add(activity);
        await _context.SaveChangesAsync();
    }

    [HttpPut("{id:guid}")]
    public async Task UpdateActivity(Guid id, Activity activity)
    {
        if (id != activity.Id) return;
        
    }
    
}