import { Testimonial } from '../types';

/**
 * Modular testimonials dataset.
 * Currently marked `isSampleData: true` with illustrative sample/demo reviews from
 * Indian customers and foreign nationals currently residing in Indian cities.
 * Replace `CUSTOMER_TESTIMONIALS` items with verified customer submissions from
 * your backend/CMS when collected, and set `isSampleData: false`.
 */
export const TESTIMONIALS_CONFIG = {
  isSampleData: true,
  disclaimerTitle: 'Sample / Demo Testimonials',
  disclaimerText:
    'Illustrative sample reviews representing Indian households and international residents living across India. Genuine verified customer reviews will replace these demo entries once collected.',
} as const;

export const CUSTOMER_TESTIMONIALS: Testimonial[] = [
  {
    id: 'demo-rev-1',
    customerName: 'Ananya Deshmukh',
    city: 'Pune',
    state: 'Maharashtra',
    residentCategory: 'indian',
    residentLabel: 'Indian Resident',
    rating: 5,
    productName: 'Pure Organic Shakkar Jar',
    productSlug: 'pure-organic-shakkar-jar',
    review:
      'Switched my morning ginger tea from refined sugar to this shakkar powder. It dissolves smoothly without curdling milk, and the airtight glass jar keeps the powder dry even in Pune humidity.',
    isSample: true,
  },
  {
    id: 'demo-rev-2',
    customerName: 'Claire Beaumont',
    city: 'Bengaluru',
    state: 'Karnataka',
    residentCategory: 'expat',
    residentLabel: 'French Expat in India',
    rating: 5,
    productName: 'Pure Desi Khand Jar',
    productSlug: 'pure-desi-khand-jar',
    review:
      'Living in Bengaluru for four years, I started baking with Desi Khand instead of bleached caster sugar. Fine amber crystals, subtle caramel warmth, and very sturdy packaging on arrival.',
    isSample: true,
  },
  {
    id: 'demo-rev-3',
    customerName: 'Rajeshwar Nair',
    city: 'Hyderabad',
    state: 'Telangana',
    residentCategory: 'indian',
    residentLabel: 'Indian Resident',
    rating: 5,
    productName: 'Dryfruits Gud Cubes Jar',
    productSlug: 'dryfruits-gud-cubes-jar',
    review:
      'Ordered the 1000g jar for after-dinner sweet cravings. Every cube has generous roasted almonds, cashews, and pistachios inside—clean cardamom aroma, never overly sticky, and well sealed.',
    isSample: true,
  },
  {
    id: 'demo-rev-4',
    customerName: 'Kenji Takahashi',
    city: 'Noida',
    state: 'Uttar Pradesh',
    residentCategory: 'expat',
    residentLabel: 'Japanese Expat in India',
    rating: 5,
    productName: 'Peanut Gud Cubes Packets',
    productSlug: 'peanut-gud-cubes-packets',
    review:
      'I work in Noida and keep these cubes at my desk for afternoon green tea breaks. Roasted peanuts stay crisp against the natural jaggery, and the zip pouch reseals tightly between servings.',
    isSample: true,
  },
  {
    id: 'demo-rev-5',
    customerName: 'Meera Kulkarni',
    city: 'Mumbai',
    state: 'Maharashtra',
    residentCategory: 'indian',
    residentLabel: 'Indian Resident',
    rating: 4,
    productName: 'Raw Gud Packets',
    productSlug: 'raw-gud-packets',
    review:
      'Earthy aroma and genuine farm colour that worked wonderfully for winter sesame laddoos. The multi-layer pouch locks out coastal Mumbai dampness well—just keep a dry spoon handy.',
    isSample: true,
  },
  {
    id: 'demo-rev-6',
    customerName: 'Elena Rostova',
    city: 'New Delhi',
    state: 'Delhi',
    residentCategory: 'expat',
    residentLabel: 'Expat Living in Delhi',
    rating: 4,
    productName: 'Raw Gud Jar',
    productSlug: 'raw-gud-jar',
    review:
      'Neighbours here in South Delhi recommended trying authentic Uttar Pradesh jaggery. Having it in a clean glass jar makes everyday kitchen storage easy, with zero gritty residue and prompt delivery.',
    isSample: true,
  },
  {
    id: 'demo-rev-7',
    customerName: 'Siddharth Verma',
    city: 'New Delhi',
    state: 'Delhi',
    residentCategory: 'indian',
    residentLabel: 'Indian Resident',
    rating: 5,
    productName: 'All in One Gud Cubes Jar',
    productSlug: 'all-in-one-gud-cubes-jar',
    review:
      'This All-in-One blend with white sesame, peanuts, almonds, and subtle sonth tastes just like traditional winter batches. Ordering took less than two minutes and delivery arrived cleanly packed.',
    isSample: true,
  },
  {
    id: 'demo-rev-8',
    customerName: 'Marcus Lindqvist',
    city: 'Mumbai',
    state: 'Maharashtra',
    residentCategory: 'expat',
    residentLabel: 'Swedish Expat in India',
    rating: 5,
    productName: 'Dryfruits Gud Cubes Packets',
    productSlug: 'dryfruits-gud-cubes-packets',
    review:
      'Great natural alternative to processed snacks while living in Bandra. Fresh cardamom scent as soon as you open the kraft packet, uniform 10g cubes, and smooth two-day shipping across Mumbai.',
    isSample: true,
  },
];
