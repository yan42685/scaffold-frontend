/* tslint:disable */
/* eslint-disable */
// NOTE: const enum是inline内联的，不能用在reactive属性中，不能在模板中使用，所以需要去掉const,直接用enum

export interface Serializable {}

export interface Result<T> {
    code: number;
    message: string;
    data: T;
}

export interface TokenDto {
    accessToken: string;
    refreshToken: string;
}
export interface IPage<T> extends Serializable {
    size: number;
    total: number;
    current: number;
    searchCount: boolean;
    pages: number;
    records: T[];
}

export const enum ExceptionEnum {
    FILE_IO_EXCEPTION = 51,
    TO_BE_IMPLEMENTED = 50,
    UNKNOWN_EXCEPTION = 99,
    NOT_REGISTER = -1,
    NOT_LOGIN = -2,
    TOKEN_EXPIRED = -3,
    WRONG_TOKEN = -4,
    NO_PERMISSION = -5,
    WRONG_CREDENTIALS = -6,
    WRONG_PASSWORD = -7,
    USERNAME_EXISTS = -8,
    USER_NOT_EXISTS = -9,
    VERIFICATION_CODE_MISMATCH = -10,
    INVALID_PARAM = -31,
    IMAGE_UPLOAD_FAIL = -32,
    DOWNLOADING_FILE_NOT_EXITS = -33,
    NUMBER_EXISTS = -41,
    NUMBER_NOT_EXIST = -42,
    FUNCTION_DISABLED = -43,
}

export enum GenderEnum {
    SECRETE = "保密",
    MALE = "男",
    FEMALE = "女",
}

export enum RoleEnum {
    ADMINISTRATOR = "ADMINISTRATOR",
    TEACHER = "TEACHER",
    STUDENT = "STUDENT",
}

export interface Student {
    id: number;
    createTime: Date;
    updateTime: Date;
    name: string;
    age: number;
    birthday: Date;
}

export interface StudentInputDto {
    id: number;
    name: string;
    age: number;
    birthday: Date;
}
