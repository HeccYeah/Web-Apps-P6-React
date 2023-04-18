using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Project5.Data;
using Project5.Models;

namespace Project5.Controllers
{
    public class RequirementsController : Controller
    {
        private readonly Project5Context _context;

        public RequirementsController(Project5Context context)
        {
            _context = context;
        }

        // GET: Requirements
        public async Task<IActionResult> Index()
        {
              return _context.Requirement != null ? 
                          View(await _context.Requirement.ToListAsync()) :
                          Problem("Entity set 'Project5Context.Requirement'  is null.");
        }

        // GET: Requirements/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null || _context.Requirement == null)
            {
                return NotFound();
            }

            var requirement = await _context.Requirement
                .FirstOrDefaultAsync(m => m.Id == id);
            if (requirement == null)
            {
                return NotFound();
            }

            return View(requirement);
        }

        // GET: Requirements/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Requirements/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,req_type")] Requirement requirement)
        {
            if (ModelState.IsValid)
            {
                _context.Add(requirement);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(requirement);
        }

        // GET: Requirements/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null || _context.Requirement == null)
            {
                return NotFound();
            }

            var requirement = await _context.Requirement.FindAsync(id);
            if (requirement == null)
            {
                return NotFound();
            }
            return View(requirement);
        }

        // POST: Requirements/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,req_type")] Requirement requirement)
        {
            if (id != requirement.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(requirement);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!RequirementExists(requirement.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(requirement);
        }

        // GET: Requirements/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null || _context.Requirement == null)
            {
                return NotFound();
            }

            var requirement = await _context.Requirement
                .FirstOrDefaultAsync(m => m.Id == id);
            if (requirement == null)
            {
                return NotFound();
            }

            return View(requirement);
        }

        // POST: Requirements/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            if (_context.Requirement == null)
            {
                return Problem("Entity set 'Project5Context.Requirement'  is null.");
            }
            var requirement = await _context.Requirement.FindAsync(id);
            if (requirement != null)
            {
                _context.Requirement.Remove(requirement);
            }
            
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool RequirementExists(int id)
        {
          return (_context.Requirement?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
