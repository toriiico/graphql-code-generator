import { Transformer } from 'apollo-client-transform/dist/defs';

export const DateTransformer: Transformer = {
  serialize(value) {
    if (!value) return value;
    return new Date(value);
  },
  parseValue(value) {
    if (!value) return value;
    return new Date(value);
  },
};

export const DateTransformerName = 'DateTransformer';
export const DateTransformerStr = `export const DateTransformer: Transformer = {
  serialize(value) {
    if (!value) return value
    return new Date(value)
  },
  parseValue(value) {
    if (!value) return value
    return new Date(value)
  },
}`;
