import { Types, PluginFunction } from '@graphql-codegen/plugin-helpers';
import { GraphQLSchema } from 'graphql';

import { DateTransformerName, DateTransformerStr } from './transform';
import { MyPluginConfig } from './config';

export const plugin: PluginFunction<MyPluginConfig> = (
  schema: GraphQLSchema,
  documents: Types.DocumentFile[],
  config: MyPluginConfig
) => {
  const typeMap = schema.getTypeMap();
  const excludeKeys = ['GeneralResponse', 'Query', 'Mutation'];

  const typeStrings: string[] = [];

  Object.entries(typeMap).forEach((tm, i) => {
    const key = tm[0];
    const value = tm[1];

    if (value.astNode?.kind === 'ObjectTypeDefinition' && !excludeKeys.includes(key)) {
      // console.log("key - ", key, ":", value.astNode?.fields)

      const fields: string[] = [];

      // NOTE: 型の都合でネスト深いけどここで書く
      for (const sc of value.astNode.fields) {
        // 必須の型 (NonNullType が入るため type がネストする)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (sc.type.type?.name?.value === 'DateTime') {
          fields.push(sc.name.value);
        }
        // optionalな型
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        else if (sc.type.name?.value === 'DateTime') {
          fields.push(sc.name.value);
        }
      }

      const fieldSet = fields.map(field => {
        return `${field}: ${DateTransformerName},`;
      });

      const perType = `${key}: {
    ${fieldSet.join('\n')}
},`;

      typeStrings.push(perType);
    }
  });

  const result = `
import { Transformer, Transformers, createTransformerLink } from "@/packages/apollo-client-transformers"

${DateTransformerStr}

export const transformers: Transformers = {
  ${typeStrings.join('\n')}
}

export const transformerLink = createTransformerLink(transformers)
`;

  return result;
};
