import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'
import Category from '#models/category'
import Event from '#models/event'
import TicketType from '#models/ticket_type'

export default class extends BaseSeeder {
  async run() {
    const concertId = crypto.randomUUID()
    const sportId = crypto.randomUUID()
    const conferenceId = crypto.randomUUID()
    const workshopId = crypto.randomUUID()
    const festivalId = crypto.randomUUID()

    await Category.createMany([
      { id: concertId, name: 'Concerts', slug: 'concerts', displayOrder: 1 },
      { id: sportId, name: 'Sports', slug: 'sports', displayOrder: 2 },
      { id: conferenceId, name: 'Conferences', slug: 'conferences', displayOrder: 3 },
      { id: workshopId, name: 'Workshops', slug: 'workshops', displayOrder: 4 },
      { id: festivalId, name: 'Festivals', slug: 'festivals', displayOrder: 5 },
    ])

    const now = DateTime.now()
    const futureDate = (days: number) => now.plus({ days })

    const jazzId = crypto.randomUUID()
    const summitId = crypto.randomUUID()
    const masterclassId = crypto.randomUUID()
    const marathonId = crypto.randomUUID()

    await Event.createMany([
      {
        id: jazzId,
        organizerId: 1,
        title: 'Kinshasa Jazz Night',
        slug: 'kinshasa-jazz-night',
        description:
          'An unforgettable evening of live jazz featuring Congolese and international artists. Enjoy world-class performances, local cuisine, and a vibrant atmosphere in the heart of Kinshasa.',
        categoryId: concertId,
        venueName: 'Grand Hotel Kinshasa',
        venueAddress: '124 Avenue des Arts, Kinshasa',
        venueCoordinates: JSON.stringify({ lat: -4.325, lng: 15.322 }),
        startDate: futureDate(30),
        endDate: futureDate(30),
        coverImageUrl: null,
        status: 'published',
        isFeatured: true,
        publishedAt: now,
      },
      {
        id: summitId,
        organizerId: 1,
        title: 'Lubumbashi Tech Summit 2026',
        slug: 'lubumbashi-tech-summit-2026',
        description:
          'The largest tech conference in the DRC. Connect with innovators, investors, and developers shaping Africa digital future. Three days of talks, workshops, and networking.',
        categoryId: conferenceId,
        venueName: 'Centre Commercial de Lubumbashi',
        venueAddress: '45 Avenue Kabila, Lubumbashi',
        venueCoordinates: JSON.stringify({ lat: -11.66, lng: 27.48 }),
        startDate: futureDate(60),
        endDate: futureDate(62),
        coverImageUrl: null,
        status: 'published',
        isFeatured: true,
        publishedAt: now,
      },
      {
        id: masterclassId,
        organizerId: 1,
        title: 'Photography Masterclass: Capturing Culture',
        slug: 'photography-masterclass',
        description:
          'A hands-on workshop led by award-winning photographer Marie Tshibola. Learn portrait, landscape, and event photography techniques tailored for the African context.',
        categoryId: workshopId,
        venueName: 'Institut Français de Kinshasa',
        venueAddress: '98 Boulevard 30 Juin, Kinshasa',
        venueCoordinates: JSON.stringify({ lat: -4.31, lng: 15.31 }),
        startDate: futureDate(45),
        endDate: futureDate(45),
        coverImageUrl: null,
        status: 'published',
        isFeatured: false,
        publishedAt: now,
      },
      {
        id: marathonId,
        organizerId: 1,
        title: 'Goma Marathon 2026',
        slug: 'goma-marathon-2026',
        description:
          'Run through the stunning landscapes near Lake Kivu. Full marathon, half marathon, and 5km fun run categories. Proceeds support local conservation efforts.',
        categoryId: null,
        venueName: 'Stade de Goma',
        venueAddress: 'Route de lUniversité, Goma',
        venueCoordinates: JSON.stringify({ lat: -1.68, lng: 29.22 }),
        startDate: futureDate(90),
        endDate: futureDate(90),
        coverImageUrl: null,
        status: 'draft',
        isFeatured: false,
        publishedAt: null,
      },
    ])

    await TicketType.createMany([
      {
        id: crypto.randomUUID(),
        eventId: jazzId,
        name: 'Standard',
        description: 'General admission with access to all performances',
        basePrice: 25.0 as unknown as string,
        currency: 'USD',
        quantityTotal: 200,
        quantitySold: 87,
        quantityReserved: 12,
        maxPerOrder: 4,
        salesStartAt: now,
        salesEndAt: futureDate(29),
        status: 'active',
        sortOrder: 1,
      },
      {
        id: crypto.randomUUID(),
        eventId: jazzId,
        name: 'VIP',
        description: 'Premium seating, meet-and-greet with artists, and complimentary drinks',
        basePrice: 75.0 as unknown as string,
        currency: 'USD',
        quantityTotal: 50,
        quantitySold: 32,
        quantityReserved: 3,
        maxPerOrder: 2,
        salesStartAt: now,
        salesEndAt: futureDate(29),
        status: 'active',
        sortOrder: 2,
      },
      {
        id: crypto.randomUUID(),
        eventId: summitId,
        name: 'Early Bird',
        description: 'Full conference access at a discounted rate',
        basePrice: 50.0 as unknown as string,
        currency: 'USD',
        quantityTotal: 100,
        quantitySold: 100,
        quantityReserved: 0,
        maxPerOrder: 5,
        salesStartAt: futureDate(-30),
        salesEndAt: futureDate(30),
        status: 'sold_out',
        sortOrder: 1,
      },
      {
        id: crypto.randomUUID(),
        eventId: summitId,
        name: 'Standard Pass',
        description: 'Full conference access for all three days',
        basePrice: 120.0 as unknown as string,
        currency: 'USD',
        quantityTotal: 300,
        quantitySold: 145,
        quantityReserved: 20,
        maxPerOrder: 5,
        salesStartAt: now,
        salesEndAt: futureDate(59),
        status: 'active',
        sortOrder: 2,
      },
      {
        id: crypto.randomUUID(),
        eventId: summitId,
        name: 'Student Pass',
        description: 'Discounted rate for students with valid ID',
        basePrice: 40.0 as unknown as string,
        currency: 'USD',
        quantityTotal: 50,
        quantitySold: 28,
        quantityReserved: 5,
        maxPerOrder: 1,
        salesStartAt: now,
        salesEndAt: futureDate(59),
        status: 'active',
        sortOrder: 3,
      },
      {
        id: crypto.randomUUID(),
        eventId: masterclassId,
        name: 'General Admission',
        description: 'Full-day workshop participation',
        basePrice: 35.0 as unknown as string,
        currency: 'USD',
        quantityTotal: 30,
        quantitySold: 12,
        quantityReserved: 2,
        maxPerOrder: 3,
        salesStartAt: now,
        salesEndAt: futureDate(44),
        status: 'active',
        sortOrder: 1,
      },
    ])
  }
}
