import Ajv from 'ajv';

import {RawMetadata} from './rawmetadata.js';
import {JSON_SCHEMA} from './schema.js';

export class Metadata {
  constructor(private readonly raw: RawMetadata) {
    validateRawMetadata(raw);
  }

  get toothRepoPath(): string {
    return this.raw.tooth;
  }

  get version(): string {
    return this.raw.version;
  }

  get name(): string {
    return this.raw.info.name;
  }

  get description(): string {
    return this.raw.info.description;
  }

  get author(): string {
    return this.raw.info.author;
  }

  get tags(): string[] {
    return this.raw.info.tags;
  }

  get avatarUrl(): string|undefined {
    return this.raw.info.avatar_url;
  }
}

function validateRawMetadata(raw: RawMetadata) {
  const ajv = new Ajv.default();
  const validate = ajv.compile(JSON_SCHEMA)
  const valid = validate(raw);

  if (!valid) {
    throw new Error(
        `tooth.json is invalid: ${ajv.errorsText(validate.errors)}`);
  }
}
