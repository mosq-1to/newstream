import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const topics = [
    {
      title: 'Artificial Intelligence',
      thumbnailUrl: 'https://images.pexels.com/photos/6153354/pexels-photo-6153354.jpeg',
      categoryTitle: 'Popular topics',
      description:
        'This topic encompasses advancements, breakthroughs, and the latest use cases of AI technologies. It highlights innovative applications and showcases trends that indicate the future direction of technological development in the field of artificial intelligence. Articles should focus on content that is engaging and relevant to the general public, ensuring accessibility and interest beyond the scientific community.',
      keywords: ['Artificial Intelligence', 'AI', 'Machinge learning'],
    },
  ];

  await prisma.topic.createMany({ data: topics });
}

void main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .then(() => {
    console.log('Seeded topics successfully!');
    process.exit(0);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
