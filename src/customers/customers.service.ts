import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer } from 'src/schemas/Customer.schema';
import { CreateBidDto } from './dtos/CreateBid.dto';
import { Bid } from 'src/schemas/Bid.schema';
import { Localhost } from 'src/schemas/Localhost.schema';
import { RoomRequests } from 'src/schemas/RoomRequests.schema';
import { EmailService } from 'src/utils/EmailService';
import { City } from 'src/schemas/City.schema';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
    @InjectModel(Bid.name) private bidModel: Model<Bid>,
    @InjectModel(Localhost.name) private localhostModel: Model<Localhost>,
    @InjectModel(RoomRequests.name) private roomRequestModel: Model<RoomRequests>,
    @InjectModel(City.name) private cityModel: Model<City>,
    private emailService: EmailService,
  ) { }

  async createBid(createBidDto: CreateBidDto) {
    const { city } = createBidDto;
    const findCity = await this.cityModel.findById(city).exec();
    if (!findCity) {
      return 'City does not exist';
    }

    const customer = await this.customerModel
      .findOne({ email: createBidDto.email })
      .exec();

    let _id;
    let CustomerName;

    if (!customer) {
      const { name, city, email } = createBidDto;
      const createdCustomer = new this.customerModel({
        name,
        city,
        email,
      });
      const savedCustomer = await createdCustomer.save();
      _id = savedCustomer._id;
      CustomerName = savedCustomer.name;
    } else {
      _id = customer._id;
      CustomerName = customer.name;
    }

    const { payment_method, price_willing_to_pay, special_instructions, what_you_need,delivery_address,} =
      createBidDto;
    const createdBid = new this.bidModel({
      customer: _id,

    
      price_willing_to_pay,
      special_instructions,
      what_you_need,
      delivery_address,
      payment_method,
    });
    const savedBid = await createdBid.save();

    if (savedBid) {
      const localhosts = await this.localhostModel
        .find({
          city: createBidDto.city,
          code_verified: true,
        })
        .exec();
      const requestsPromises = localhosts.map((localhost) =>
        this.roomRequestModel.create({
          bid: savedBid._id,
          localhost: localhost._id,
        }),
      );
      await Promise.all(requestsPromises);

      const emailsPromises = localhosts.map((localhost) =>
        this.emailService.sendEmail(
          localhost.email,
          'A New Room Request - Last Minute Booking',
          `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>New Room Request</title>
            </head>
            <body>
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>A New Room Request</h2>
                    <p>Hello,</p>
                    <p>A new room request has been received:</p>
                    <ul>
                        <li><strong>Name:</strong> ${CustomerName}</li>
                        <li><strong>City:</strong> ${findCity.city_name}</li>
                         <li><strong>What Do You Need:</strong> ${what_you_need}</li>
                         <li><strong>Complete Address:</strong> ${delivery_address}</li>
                           <li><strong>Complete Address:</strong> ${payment_method}</li>
                       
                        <li><strong>Special Instructions:</strong> ${special_instructions}</li>
                    </ul>
                    <a href="https://m59media.com/negotiate?id=${savedBid._id}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none;">Negotiate Room Stay</a>
                    <p>If you have any questions or concerns, please contact us.</p>
                    <p>Thank you!</p>
                </div>
            </body>
            </html>
          `,
        ),
      );
      await Promise.all(emailsPromises);

      try {
        await this.emailService.sendEmail(
          createBidDto.email,
          'Confirmation - Last Minute Booking',
          `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Confirmation</title>
            </head>
            <body>
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Confirmation</h2>
                    <p>Thank you,</p>
                    <p>This email confirms that you will receive an email if a room is available.</p>
                </div>
            </body>
            </html>
          `,
        );
        return savedBid;
      } catch (error) {
        console.log('Error sending confirmation email', error);
        return null;
      }
    }

    return null;
  }
}
