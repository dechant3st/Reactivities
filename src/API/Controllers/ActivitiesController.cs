using Persistence;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Domain.Entities;
using System;

namespace API.Controllers
{
    public class ActivitiesController: BaseApiController
    {
        private readonly DataContext _context;

        public ActivitiesController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Activity>>> GetActivities() 
        {
            return await _context.Activities.ToListAsync();
        }

        [HttpGet("{id}")] // activities/id
        public async Task<ActionResult<Activity>> GetActivity(Guid id) 
        {
            return await _context.Activities.FindAsync(id);
        }
    }
}