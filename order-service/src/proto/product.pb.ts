import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "product";

export interface FindOneRequest {
    id: number;
}

export interface FindOneResponse {
    product: Product | undefined;
}

export interface DecreaseQuantityRequest {
    id: number;
    quantity: number;
}

export interface DecreaseQuantityResponse {
    success: boolean;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    availableQuantity: number;
}

function createBaseFindOneRequest(): FindOneRequest {
    return { id: 0 };
}

export const FindOneRequest: MessageFns<FindOneRequest> = {
    encode(message: FindOneRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
        if (message.id !== 0) {
            writer.uint32(8).int32(message.id);
        }
        return writer;
    },

    decode(input: BinaryReader | Uint8Array, length?: number): FindOneRequest {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseFindOneRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1: {
                    if (tag !== 8) {
                        break;
                    }

                    message.id = reader.int32();
                    continue;
                }
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skip(tag & 7);
        }
        return message;
    },

    fromJSON(object: any): FindOneRequest {
        return { id: isSet(object.id) ? globalThis.Number(object.id) : 0 };
    },

    toJSON(message: FindOneRequest): unknown {
        const obj: any = {};
        if (message.id !== 0) {
            obj.id = Math.round(message.id);
        }
        return obj;
    },

    create<I extends Exact<DeepPartial<FindOneRequest>, I>>(base?: I): FindOneRequest {
        return FindOneRequest.fromPartial(base ?? ({} as any));
    },
    fromPartial<I extends Exact<DeepPartial<FindOneRequest>, I>>(object: I): FindOneRequest {
        const message = createBaseFindOneRequest();
        message.id = object.id ?? 0;
        return message;
    },
};

function createBaseFindOneResponse(): FindOneResponse {
    return { product: undefined };
}

export const FindOneResponse: MessageFns<FindOneResponse> = {
    encode(message: FindOneResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
        if (message.product !== undefined) {
            Product.encode(message.product, writer.uint32(10).fork()).join();
        }
        return writer;
    },

    decode(input: BinaryReader | Uint8Array, length?: number): FindOneResponse {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseFindOneResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1: {
                    if (tag !== 10) {
                        break;
                    }

                    message.product = Product.decode(reader, reader.uint32());
                    continue;
                }
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skip(tag & 7);
        }
        return message;
    },

    fromJSON(object: any): FindOneResponse {
        return { product: isSet(object.product) ? Product.fromJSON(object.product) : undefined };
    },

    toJSON(message: FindOneResponse): unknown {
        const obj: any = {};
        if (message.product !== undefined) {
            obj.product = Product.toJSON(message.product);
        }
        return obj;
    },

    create<I extends Exact<DeepPartial<FindOneResponse>, I>>(base?: I): FindOneResponse {
        return FindOneResponse.fromPartial(base ?? ({} as any));
    },
    fromPartial<I extends Exact<DeepPartial<FindOneResponse>, I>>(object: I): FindOneResponse {
        const message = createBaseFindOneResponse();
        message.product = (object.product !== undefined && object.product !== null)
            ? Product.fromPartial(object.product)
            : undefined;
        return message;
    },
};

function createBaseDecreaseQuantityRequest(): DecreaseQuantityRequest {
    return { id: 0, quantity: 0 };
}

export const DecreaseQuantityRequest: MessageFns<DecreaseQuantityRequest> = {
    encode(message: DecreaseQuantityRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
        if (message.id !== 0) {
            writer.uint32(8).int32(message.id);
        }
        if (message.quantity !== 0) {
            writer.uint32(16).int32(message.quantity);
        }
        return writer;
    },

    decode(input: BinaryReader | Uint8Array, length?: number): DecreaseQuantityRequest {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseDecreaseQuantityRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1: {
                    if (tag !== 8) {
                        break;
                    }

                    message.id = reader.int32();
                    continue;
                }
                case 2: {
                    if (tag !== 16) {
                        break;
                    }

                    message.quantity = reader.int32();
                    continue;
                }
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skip(tag & 7);
        }
        return message;
    },

    fromJSON(object: any): DecreaseQuantityRequest {
        return {
            id: isSet(object.id) ? globalThis.Number(object.id) : 0,
            quantity: isSet(object.quantity) ? globalThis.Number(object.quantity) : 0,
        };
    },

    toJSON(message: DecreaseQuantityRequest): unknown {
        const obj: any = {};
        if (message.id !== 0) {
            obj.id = Math.round(message.id);
        }
        if (message.quantity !== 0) {
            obj.quantity = Math.round(message.quantity);
        }
        return obj;
    },

    create<I extends Exact<DeepPartial<DecreaseQuantityRequest>, I>>(base?: I): DecreaseQuantityRequest {
        return DecreaseQuantityRequest.fromPartial(base ?? ({} as any));
    },
    fromPartial<I extends Exact<DeepPartial<DecreaseQuantityRequest>, I>>(object: I): DecreaseQuantityRequest {
        const message = createBaseDecreaseQuantityRequest();
        message.id = object.id ?? 0;
        message.quantity = object.quantity ?? 0;
        return message;
    },
};

function createBaseDecreaseQuantityResponse(): DecreaseQuantityResponse {
    return { success: false };
}

export const DecreaseQuantityResponse: MessageFns<DecreaseQuantityResponse> = {
    encode(message: DecreaseQuantityResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
        if (message.success !== false) {
            writer.uint32(8).bool(message.success);
        }
        return writer;
    },

    decode(input: BinaryReader | Uint8Array, length?: number): DecreaseQuantityResponse {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseDecreaseQuantityResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1: {
                    if (tag !== 8) {
                        break;
                    }

                    message.success = reader.bool();
                    continue;
                }
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skip(tag & 7);
        }
        return message;
    },

    fromJSON(object: any): DecreaseQuantityResponse {
        return { success: isSet(object.success) ? globalThis.Boolean(object.success) : false };
    },

    toJSON(message: DecreaseQuantityResponse): unknown {
        const obj: any = {};
        if (message.success !== false) {
            obj.success = message.success;
        }
        return obj;
    },

    create<I extends Exact<DeepPartial<DecreaseQuantityResponse>, I>>(base?: I): DecreaseQuantityResponse {
        return DecreaseQuantityResponse.fromPartial(base ?? ({} as any));
    },
    fromPartial<I extends Exact<DeepPartial<DecreaseQuantityResponse>, I>>(object: I): DecreaseQuantityResponse {
        const message = createBaseDecreaseQuantityResponse();
        message.success = object.success ?? false;
        return message;
    },
};

function createBaseProduct(): Product {
    return { id: 0, name: "", description: "", price: 0, availableQuantity: 0 };
}

export const Product: MessageFns<Product> = {
    encode(message: Product, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
        if (message.id !== 0) {
            writer.uint32(8).int32(message.id);
        }
        if (message.name !== "") {
            writer.uint32(18).string(message.name);
        }
        if (message.description !== "") {
            writer.uint32(26).string(message.description);
        }
        if (message.price !== 0) {
            writer.uint32(33).double(message.price);
        }
        if (message.availableQuantity !== 0) {
            writer.uint32(40).int32(message.availableQuantity);
        }
        return writer;
    },

    decode(input: BinaryReader | Uint8Array, length?: number): Product {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseProduct();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1: {
                    if (tag !== 8) {
                        break;
                    }

                    message.id = reader.int32();
                    continue;
                }
                case 2: {
                    if (tag !== 18) {
                        break;
                    }

                    message.name = reader.string();
                    continue;
                }
                case 3: {
                    if (tag !== 26) {
                        break;
                    }

                    message.description = reader.string();
                    continue;
                }
                case 4: {
                    if (tag !== 33) {
                        break;
                    }

                    message.price = reader.double();
                    continue;
                }
                case 5: {
                    if (tag !== 40) {
                        break;
                    }

                    message.availableQuantity = reader.int32();
                    continue;
                }
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skip(tag & 7);
        }
        return message;
    },

    fromJSON(object: any): Product {
        return {
            id: isSet(object.id) ? globalThis.Number(object.id) : 0,
            name: isSet(object.name) ? globalThis.String(object.name) : "",
            description: isSet(object.description) ? globalThis.String(object.description) : "",
            price: isSet(object.price) ? globalThis.Number(object.price) : 0,
            availableQuantity: isSet(object.availableQuantity) ? globalThis.Number(object.availableQuantity) : 0,
        };
    },

    toJSON(message: Product): unknown {
        const obj: any = {};
        if (message.id !== 0) {
            obj.id = Math.round(message.id);
        }
        if (message.name !== "") {
            obj.name = message.name;
        }
        if (message.description !== "") {
            obj.description = message.description;
        }
        if (message.price !== 0) {
            obj.price = message.price;
        }
        if (message.availableQuantity !== 0) {
            obj.availableQuantity = Math.round(message.availableQuantity);
        }
        return obj;
    },

    create<I extends Exact<DeepPartial<Product>, I>>(base?: I): Product {
        return Product.fromPartial(base ?? ({} as any));
    },
    fromPartial<I extends Exact<DeepPartial<Product>, I>>(object: I): Product {
        const message = createBaseProduct();
        message.id = object.id ?? 0;
        message.name = object.name ?? "";
        message.description = object.description ?? "";
        message.price = object.price ?? 0;
        message.availableQuantity = object.availableQuantity ?? 0;
        return message;
    },
};

export interface ProductService {
    FindOne(request: FindOneRequest): Promise<FindOneResponse>;
    DecreaseQuantity(request: DecreaseQuantityRequest): Promise<DecreaseQuantityResponse>;
}

export const ProductServiceServiceName = "product.ProductService";
export class ProductServiceClientImpl implements ProductService {
    private readonly rpc: Rpc;
    private readonly service: string;
    constructor(rpc: Rpc, opts?: { service?: string }) {
        this.service = opts?.service || ProductServiceServiceName;
        this.rpc = rpc;
        this.FindOne = this.FindOne.bind(this);
        this.DecreaseQuantity = this.DecreaseQuantity.bind(this);
    }
    FindOne(request: FindOneRequest): Promise<FindOneResponse> {
        const data = FindOneRequest.encode(request).finish();
        const promise = this.rpc.request(this.service, "FindOne", data);
        return promise.then((data) => FindOneResponse.decode(new BinaryReader(data)));
    }

    DecreaseQuantity(request: DecreaseQuantityRequest): Promise<DecreaseQuantityResponse> {
        const data = DecreaseQuantityRequest.encode(request).finish();
        const promise = this.rpc.request(this.service, "DecreaseQuantity", data);
        return promise.then((data) => DecreaseQuantityResponse.decode(new BinaryReader(data)));
    }
}

interface Rpc {
    request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
    : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
    : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
    : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
    : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
    : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
    return value !== null && value !== undefined;
}

export interface MessageFns<T> {
    encode(message: T, writer?: BinaryWriter): BinaryWriter;
    decode(input: BinaryReader | Uint8Array, length?: number): T;
    fromJSON(object: any): T;
    toJSON(message: T): unknown;
    create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
    fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}
