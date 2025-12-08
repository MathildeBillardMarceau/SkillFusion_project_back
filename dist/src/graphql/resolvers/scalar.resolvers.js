import { DateTimeResolver, EmailAddressResolver, UUIDResolver, } from "graphql-scalars";
export const scalarResolvers = {
    DateTime: DateTimeResolver,
    EmailAddress: EmailAddressResolver,
    UUID: UUIDResolver,
};
