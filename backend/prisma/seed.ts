import { PrismaClient, Role, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

    // Clear existing data to ensure a clean slate
    await prisma.issuedTicket.deleteMany({});
    await prisma.image.deleteMany({});
    await prisma.event.deleteMany({});
    await prisma.venue.deleteMany({});
    await prisma.organization.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.currency.deleteMany({});

    // 1. Create a Currency
    const currency = await prisma.currency.create({
        data: { name: 'Vietnamese Dong', symbol: 'VND' },
    });
    console.log(`Created currency: ${currency.name}`);

    // 2. Create an Organization
    const organization = await prisma.organization.create({
        data: { name: 'Starlight Events' },
    });
    console.log(`Created organization: ${organization.name}`);

    // 3. Create a User (Organizer)
    // In a real app, the password would be hashed.
    await prisma.user.create({
        data: {
            username: 'eventmanager',
            password: 'password123',
            roles: [Role.Organizer, Role.Admin],
            organizationId: organization.id,
        },
    });
    console.log('Created organizer user.');

    // 4. Create a Venue
    const venue = await prisma.venue.create({
        data: {
            name: 'Grand Theater',
            address: '123 Main St, Cityville',
            layout: {
                rows: [
                    [{ type: 'stage' }, { type: 'stage' }, { type: 'stage' }],
                    [{ type: 'empty' }],
                    [{ type: 'seat', seatId: 'A1' }, { type: 'seat', seatId: 'A2' }, { type: 'seat', seatId: 'A3' }],
                    [{ type: 'seat', seatId: 'B1' }, { type: 'seat', seatId: 'B2' }, { type: 'seat', seatId: 'B3' }],
                    [{ type: 'seat', seatId: 'C1' }, { type: 'seat', seatId: 'C2' }, { type: 'seat', seatId: 'C3' }],
                ],
            },
        },
    });
    console.log(`Created venue: ${venue.name}`);

    // 5. Define the ticket configuration an organizer would provide
    const ticketConfig = {
        seatClasses: [
            { id: 'premium', name: 'Premium', price: 250000, color: '#8b5cf6' },
            { id: 'standard', name: 'Standard', price: 120000, color: '#4B5563' },
            { id: 'unavailable', name: 'Unavailable', price: 0, color: '#D1D5DB' },
        ],
        seatAssignments: {
            A1: 'premium', A2: 'premium', A3: 'premium',
            B1: 'standard', B2: 'standard', B3: 'standard',
            C1: 'standard', C2: 'unavailable', C3: 'standard',
        },
    };

    // 6. Create an Event
    const event = await prisma.event.create({
        data: {
            title: 'Live Jazz Night',
            description: "An evening of smooth jazz with the city's finest musicians.",
            type: 'offline',
            active_start_date: new Date('2025-08-31T19:00:00Z'),
            active_end_date: new Date('2025-08-31T22:00:00Z'),
            sale_start_date: new Date(), // Start sale now
            sale_end_date: new Date('2025-08-30T23:00:00Z'),
            ticketConfiguration: ticketConfig, // Store the raw config
            organizationId: organization.id,
            venueId: venue.id,
            tagIds: [],
        },
    });
    console.log(`Created event: ${event.title}`);

    // Create an image for the event
    await prisma.image.create({
        data: {
            type: "banner",
            url: "https://placehold.co/1200x600/ef4444/white?text=Jazz+Night",
            eventId: event.id
        }
    });
    console.log('Added banner image to event.');


    // 7. Process the config to create IssuedTicket records
    const seatClassMap = new Map(ticketConfig.seatClasses.map((sc) => [sc.id, sc]));

    const ticketsToCreate: Prisma.IssuedTicketCreateManyInput[] = Object.entries(ticketConfig.seatAssignments)
        .map(([seatNumber, classId]) => {
            const seatClass = seatClassMap.get(classId);
            if (!seatClass) return null;

            const isUnavailable = classId === 'unavailable';
            return {
                eventId: event.id,
                organizationId: organization.id,
                currencyId: currency.id,
                seat: seatNumber,
                status: isUnavailable ? 'UNAVAILABLE' : 'AVAILABLE',
                price: seatClass.price,
                class: seatClass.name, // 'class' is the field in your schema
            };
        })
        .filter((ticket): ticket is Prisma.IssuedTicketCreateManyInput => ticket !== null);


    await prisma.issuedTicket.createMany({
        data: ticketsToCreate,
    });
    console.log(`Created ${ticketsToCreate.length} tickets for the event.`);

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });