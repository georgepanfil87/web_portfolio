import { ChangeDetectionStrategy, Component, VERSION, afterNextRender, inject } from '@angular/core';
import { SITE_CONFIG } from './core/config/site.config';
import { ProjectsService } from './core/services/projects.service';
import { About } from './sections/about/about';
import { Contact } from './sections/contact/contact';
import { Education } from './sections/education/education';
import { Experience } from './sections/experience/experience';
import { Hero } from './sections/hero/hero';
import { Projects } from './sections/projects/projects';
import { Skills } from './sections/skills/skills';
import { NavHeader } from './ui/nav-header/nav-header';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NavHeader, Hero, About, Skills, Projects, Experience, Education, Contact],
  templateUrl: './app.html',
})
export class App {
  private readonly projectsService = inject(ProjectsService);

  protected readonly owner = SITE_CONFIG.owner;
  protected readonly year = new Date().getFullYear();
  protected readonly angularVersion = VERSION.major;

  constructor() {
   
    afterNextRender(() => {
      void this.projectsService.load();
    });
  }
}
