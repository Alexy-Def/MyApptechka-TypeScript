import path from 'path';

/*
  We need to store email templates in each module, that use it, by path src/{moduleName}/templates
*/
export function getTemplatePath(moduleName: string, templateName: string): string {
  return path.join(__dirname, moduleName, 'templates', `${templateName}.handlebars`);
}
