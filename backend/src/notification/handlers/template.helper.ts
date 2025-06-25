import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';

export function renderTemplate(template: string, data: Record<string, any>): string {
  const compiled = Handlebars.compile(template);
  return compiled(data);
}

export function renderTemplateFromFile(templateKey: string, data: Record<string, any>, type: 'html' | 'txt' = 'html'): string {
  const ext = type === 'html' ? 'html' : 'txt';
  const templatePath = path.join(__dirname, '..', 'templates', 'email', `${templateKey}.${ext}`);
  const templateContent = fs.readFileSync(templatePath, 'utf8');
  const compiled = Handlebars.compile(templateContent);
  return compiled(data);
}
