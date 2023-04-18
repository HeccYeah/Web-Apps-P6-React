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
    public class HasCoursesController : Controller
    {
        private readonly Project5Context _context;

        public HasCoursesController(Project5Context context)
        {
            _context = context;
        }

        // GET: HasCourses
        public async Task<IActionResult> Index()
        {
              return _context.HasCourse != null ? 
                          View(await _context.HasCourse.ToListAsync()) :
                          Problem("Entity set 'Project5Context.HasCourse'  is null.");
        }

        // GET: HasCourses/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null || _context.HasCourse == null)
            {
                return NotFound();
            }

            var hasCourse = await _context.HasCourse
                .FirstOrDefaultAsync(m => m.Id == id);
            if (hasCourse == null)
            {
                return NotFound();
            }

            return View(hasCourse);
        }

        // GET: HasCourses/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: HasCourses/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,sem,year")] HasCourse hasCourse)
        {
            if (ModelState.IsValid)
            {
                _context.Add(hasCourse);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(hasCourse);
        }

        // GET: HasCourses/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null || _context.HasCourse == null)
            {
                return NotFound();
            }

            var hasCourse = await _context.HasCourse.FindAsync(id);
            if (hasCourse == null)
            {
                return NotFound();
            }
            return View(hasCourse);
        }

        // POST: HasCourses/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,sem,year")] HasCourse hasCourse)
        {
            if (id != hasCourse.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(hasCourse);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!HasCourseExists(hasCourse.Id))
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
            return View(hasCourse);
        }

        // GET: HasCourses/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null || _context.HasCourse == null)
            {
                return NotFound();
            }

            var hasCourse = await _context.HasCourse
                .FirstOrDefaultAsync(m => m.Id == id);
            if (hasCourse == null)
            {
                return NotFound();
            }

            return View(hasCourse);
        }

        // POST: HasCourses/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            if (_context.HasCourse == null)
            {
                return Problem("Entity set 'Project5Context.HasCourse'  is null.");
            }
            var hasCourse = await _context.HasCourse.FindAsync(id);
            if (hasCourse != null)
            {
                _context.HasCourse.Remove(hasCourse);
            }
            
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool HasCourseExists(int id)
        {
          return (_context.HasCourse?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
