// Função para aplicar decorators
export function applyDecorators(...decorators: PropertyDecorator[]): PropertyDecorator {
  return (target, propertyKey) => {
    for (const decorator of decorators) {
      decorator(target, propertyKey);
    }
  };
}
