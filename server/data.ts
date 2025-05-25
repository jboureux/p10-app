import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      email: '  autre-test@p10.com',
      firstname: 'Test',
      lastname: 'User',
      password: 'hashedpassword',
      role: 'USER',
      apiAvatarId: 'avatar1',
    },
  });

  const track = await prisma.track.create({
    data: {
      countryName: 'France',
      trackName: 'Circuit Paul Ricard',
      pictureCountry: 'france.png',
      pictureTrack: 'ricard.png',
    },
  });

  const grandPrix = await prisma.grandPrix.create({
    data: {
      season: '2025',
      date: new Date('2025-06-15T14:00:00Z'),
      time: new Date('2025-06-15T14:00:00Z'),
      idApiTrack: track.idApiTrack,
    },
  });

  const ecurie = await prisma.ecurie.create({
    data: {
      idApiEcurie: 'ecurie-1',
      name: 'Red Bull',
      logo: 'redbull.png',
      color: '#0000FF',
    },
  });

  const pilote = await prisma.pilote.create({
    data: {
      name: 'Max Verstappen',
      picture: 'max.png',
      nameAcronym: 'VER',
    },
  });

  const piloteEcurie = await prisma.piloteEcurie.create({
    data: {
      piloteId: pilote.idApiPilote,
      ecurieId: ecurie.idApiEcurie,
      year: new Date(),
    },
  });

  const grandPrixPilote = await prisma.grandPrixPilote.create({
    data: {
      idGrandPrix: grandPrix.idApiRaces,
      idPilote: pilote.idApiPilote,
      idEcurie: ecurie.idApiEcurie,
    },
  });

  console.log({
    userId: user.id,
    grandPrixId: grandPrix.idApiRaces,
    grandPrixPiloteId: grandPrixPilote.id,
  });
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
