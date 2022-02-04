using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Collections.Generic;
using Domain.Entities;
using System;
using Application.Activities;
using System.Threading;
using Microsoft.AspNetCore.Authorization;
using Application.Core;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetActivities([FromQuery] ActivityParams param)
        {
            return HandlePagedResult(await Mediator.Send(new List.Query { Params = param }));
        }

        [HttpGet("{id}")] // activities/id
        public async Task<IActionResult> GetActivity(Guid id, CancellationToken cancellationToken)
        {
            var result = await Mediator.Send(new Details.Query { Id = id }, cancellationToken);
            return HandleResult(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateActivity(Activity activity, CancellationToken cancellationToken)
        {
            return HandleResult(await Mediator.Send(new Create.Command { Activity = activity }, cancellationToken));
        }

        [Authorize(Policy = "IsActivityHost")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivities(Guid id, Activity activity, CancellationToken cancellationToken)
        {
            activity.Id = id;
            return HandleResult(await Mediator.Send(new Edit.Command { Activity = activity }, cancellationToken));
        }

        [Authorize(Policy = "IsActivityHost")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id, CancellationToken cancellationToken)
        {
            return HandleResult(await Mediator.Send(new Delete.Command { Id = id }, cancellationToken));
        }

        [HttpPost("{id}/attend")]
        public async Task<IActionResult> Attend(Guid id, CancellationToken cancellationToken)
        {
            return HandleResult(await Mediator.Send(new UpdateAttendance.Command { Id = id }));
        }
    }
}