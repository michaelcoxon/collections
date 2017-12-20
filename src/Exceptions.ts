export class ArgumentException extends Error
{
    constructor(argumentName: string, message?: string)
    {
        super("'" + argumentName + "' " + (message || ""));
        this.name = 'ArgumentException';
    }
}

export class InvalidTypeException extends Error
{
    constructor(variableName: string, expectedTypeName: string)
    {
        super('Type of ' + variableName + ' is not supported, ' + expectedTypeName + ' expected');
        this.name = 'InvalidTypeException';
    }
}

export class NotImplementedException extends Error
{
    constructor(methodName: string)
    {
        super('This method has not been implemented. "' + methodName + '"');
        this.name = 'NotImplementedException';
    }
}


export class NotSupportedException extends Error
{
    constructor(name: string)
    {
        super('"' + name + '" is not supported');
        this.name = 'NotSupportedException';
    }
}

export class OutOfBoundsException extends Error
{
    constructor(variableName: string, minBound: number, maxBound: number)
    {
        super('The value of ' + variableName + ' is out of bounds. min: ' + minBound + ' max: ' + maxBound);
        this.name = 'OutOfBoundsException';
    }
}

export class UndefinedArgumentException extends Error
{
    constructor(argumentName: string)
    {
        super(argumentName + ' is undefined');
        this.name = 'UndefinedArgumentException';
    }
}

export class FileNotFoundException extends Error
{
    constructor(filename: string)
    {
        super(`File '${filename}' is not found`);
        this.name = 'FileNotFoundException';
    }
}
