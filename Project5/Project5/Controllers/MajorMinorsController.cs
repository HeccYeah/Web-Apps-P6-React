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
    public class MajorMinorsController : Controller
    {
        private readonly Project5Context _context;

        public MajorMinorsController(Project5Context context)
        {
            _context = context;
        }

        // GET: MajorMinors
        public async Task<IActionResult> Index()
        {
              return _context.MajorMinor != null ? 
                          View(await _context.MajorMinor.ToListAsync()) :
                          Problem("Entity set 'Project5Context.MajorMinor'  is null.");
        }

        // GET: MajorMinors/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null || _context.MajorMinor == null)
            {
                return NotFound();
            }

            var majorMinor = await _context.MajorMinor
                .FirstOrDefaultAsync(m => m.Id == id);
            if (majorMinor == null)
            {
                return NotFound();
            }

            return View(majorMinor);
        }

        // GET: MajorMinors/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: MajorMinors/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,title,is_minor")] MajorMinor majorMinor)
        {
            if (ModelState.IsValid)
            {
                _context.Add(majorMinor);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(majorMinor);
        }

        // GET: MajorMinors/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null || _context.MajorMinor == null)
            {
                return NotFound();
            }

            var majorMinor = await _context.MajorMinor.FindAsync(id);
            if (majorMinor == null)
            {
                return NotFound();
            }
            return View(majorMinor);
        }

        // POST: MajorMinors/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,title,is_minor")] MajorMinor majorMinor)
        {
            if (id != majorMinor.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(majorMinor);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!MajorMinorExists(majorMinor.Id))
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
            return View(majorMinor);
        }

        // GET: MajorMinors/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null || _context.MajorMinor == null)
            {
                return NotFound();
            }

            var majorMinor = await _context.MajorMinor
                .FirstOrDefaultAsync(m => m.Id == id);
            if (majorMinor == null)
            {
                return NotFound();
            }

            return View(majorMinor);
        }

        // POST: MajorMinors/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            if (_context.MajorMinor == null)
            {
                return Problem("Entity set 'Project5Context.MajorMinor'  is null.");
            }
            var majorMinor = await _context.MajorMinor.FindAsync(id);
            if (majorMinor != null)
            {
                _context.MajorMinor.Remove(majorMinor);
            }
            
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool MajorMinorExists(int id)
        {
          return (_context.MajorMinor?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
