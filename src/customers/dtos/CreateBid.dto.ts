import { IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class CreateBidDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    name: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(50)
    email: string;

    @IsString()
    @IsNotEmpty()
    city: string;

   

    @IsNotEmpty()
    price_willing_to_pay: number;

    @IsNotEmpty()
    @IsString()
    special_instructions: string;

    @IsNotEmpty()
    @IsString()
    what_you_need: string;

    @IsNotEmpty()
    @IsString()
    delivery_address: string;

    @IsNotEmpty()
    @IsString()
    payment_method: string;
}