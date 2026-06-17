import Contact from '../entities/contact.entity';
import { CreatePersonDto } from '../dto/create-person.dto';
import GooglePlaceDto from '../../vendor/google-place.dto';
export declare const getContactModel: (
  personDto: CreatePersonDto,
  place?: GooglePlaceDto,
) => Contact;
