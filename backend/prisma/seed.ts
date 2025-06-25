import { PrismaClient, Role, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

    // Clear existing data to ensure a clean slate
    await prisma.claimedTicket.deleteMany({});
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
    await prisma.user.create({
        data: {
            username: 'eventmanager',
            password: 'An123456789.',
            roles: [Role.Organizer],
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
                    [{ type: 'stage' }, { type: 'stage' }, { type: 'stage' }, { type: 'stage' }, { type: 'stage' }],
                    [{ type: 'empty' }],
                    [{ type: 'seat', seatId: 'A1' }, { type: 'seat', seatId: 'A2' }, { type: 'seat', seatId: 'A3' }, { type: 'seat', seatId: 'A4' }, { type: 'seat', seatId: 'A5' }, { type: 'seat', seatId: 'A6' }, { type: 'seat', seatId: 'A7' }, { type: 'seat', seatId: 'A8' }, { type: 'seat', seatId: 'A9' }, { type: 'seat', seatId: 'A10' }],
                    [{ type: 'seat', seatId: 'B1' }, { type: 'seat', seatId: 'B2' }, { type: 'seat', seatId: 'B3' }, { type: 'seat', seatId: 'B4' }, { type: 'seat', seatId: 'B5' }, { type: 'seat', seatId: 'B6' }, { type: 'seat', seatId: 'B7' }, { type: 'seat', seatId: 'B8' }, { type: 'seat', seatId: 'B9' }, { type: 'seat', seatId: 'B10' }],
                    [{ type: 'seat', seatId: 'C1' }, { type: 'seat', seatId: 'C2' }, { type: 'seat', seatId: 'C3' }, { type: 'seat', seatId: 'C4' }, { type: 'seat', seatId: 'C5' }, { type: 'seat', seatId: 'C6' }, { type: 'seat', seatId: 'C7' }, { type: 'seat', seatId: 'C8' }, { type: 'seat', seatId: 'C9' }, { type: 'seat', seatId: 'C10' }],
                    [{ type: 'seat', seatId: 'D1' }, { type: 'seat', seatId: 'D2' }, { type: 'seat', seatId: 'D3' }, { type: 'seat', seatId: 'D4' }, { type: 'seat', seatId: 'D5' }, { type: 'seat', seatId: 'D6' }, { type: 'seat', seatId: 'D7' }, { type: 'seat', seatId: 'D8' }, { type: 'seat', seatId: 'D9' }, { type: 'seat', seatId: 'D10' }],
                    [{ type: 'seat', seatId: 'E1' }, { type: 'seat', seatId: 'E2' }, { type: 'seat', seatId: 'E3' }, { type: 'seat', seatId: 'E4' }, { type: 'seat', seatId: 'E5' }, { type: 'seat', seatId: 'E6' }, { type: 'seat', seatId: 'E7' }, { type: 'seat', seatId: 'E8' }, { type: 'seat', seatId: 'E9' }, { type: 'seat', seatId: 'E10' }],
                ],
            },
        },
    });
    console.log(`Created venue: ${venue.name}`);

    // 5. Define the ticket configuration
    const ticketConfig = {
        seatClasses: [
            { id: "premium", name: "Premium Test Seating", price: 2000, color: "#8b5cf6" },
            { id: "standard", name: "Standard Seating", price: 1000, color: "#7DDA58" },
            { id: "unavailable", name: "Unavailable", price: 0, color: "#D1D5DB" },
        ],
        seatAssignments: {
            "A1": "premium", "A2": "premium", "A3": "premium", "A4": "premium", "A5": "premium", "A6": "premium", "A7": "premium", "A8": "premium", "A9": "premium", "A10": "premium",
            "B1": "premium", "B2": "premium", "B3": "premium", "B4": "premium", "B5": "premium", "B6": "premium", "B7": "premium", "B8": "premium", "B9": "premium", "B10": "premium",
            "C1": "standard", "C2": "standard", "C3": "standard", "C4": "standard", "C5": "standard", "C6": "standard", "C7": "standard", "C8": "standard", "C9": "standard", "C10": "standard",
            "D1": "standard", "D2": "standard", "D3": "standard", "D4": "standard", "D5": "standard", "D6": "standard", "D7": "standard", "D8": "standard", "D9": "standard", "D10": "standard",
            "E1": "standard", "E2": "standard", "E3": "standard", "E4": "standard", "E5": "standard", "E6": "unavailable", "E7": "unavailable", "E8": "unavailable", "E9": "unavailable", "E10": "unavailable",
        },
    };

    // 6. Create an Event
    const event = await prisma.event.create({
        data: {
            title: 'Live Beauty Night',
            description: "Perfect Beauty",
            type: 'ONSITE',
            active_start_date: new Date('2025-08-31T19:00:00Z'),
            active_end_date: new Date('2025-08-31T22:00:00Z'),
            sale_start_date: new Date(),
            sale_end_date: new Date('2025-08-30T23:00:00Z'),
            ticketConfiguration: ticketConfig,
            organizationId: organization.id,
            venueId: venue.id,
            tagIds: [],
            posterId: '',
        },
    });
    console.log(`Created event: ${event.title}`);

    // ... (image creation code)

    // 7. Process the config to create IssuedTicket records
    const seatClassMap = new Map(ticketConfig.seatClasses.map((sc) => [sc.id, sc]));

    const ticketsToCreate: Prisma.IssuedTicketCreateManyInput[] = Object.entries(
        ticketConfig.seatAssignments
    )
        .map(([seatNumber, classId]) => {
            const seatClass = seatClassMap.get(String(classId));
            if (!seatClass) {
                return null;
            }

            const isUnavailable = classId === "unavailable";

            const ticket: Prisma.IssuedTicketCreateManyInput = {
                eventId: event.id,
                organizationId: organization.id,
                currencyId: currency.id,
                seat: seatNumber,
                status: isUnavailable ? "UNAVAILABLE" : "AVAILABLE",
                price: seatClass.price,
                class: seatClass.name,
                classColor: seatClass.color,
            };
            return ticket;
        })
        // This filter now works correctly because the type predicate is valid
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
