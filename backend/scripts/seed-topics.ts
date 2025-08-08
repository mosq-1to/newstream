import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const topics = [
    {
      title: 'Artificial Intelligence',
      thumbnailUrl: 'https://images.pexels.com/photos/6153354/pexels-photo-6153354.jpeg',
      categoryTitle: 'Popular topics',
      description: `This topic encompasses advancements, breakthroughs, and the latest use cases of AI technologies. It highlights innovative applications and showcases trends that indicate the future direction of technological development in the field of artificial intelligence. Articles should focus on content that is engaging and relevant to the general public, ensuring accessibility and interest beyond the scientific community.
        Articles about stock prices or financial reports of various companies should be marked as irrelevant.`,
      keywords: ['Artificial Intelligence', 'AI', 'Machinge learning'],
    },
  ];

  // Process topics one by one - find by title then update or create
  for (const topic of topics) {
    // Find existing topic with the same title
    const existingTopic = await prisma.topic.findFirst({
      where: { title: topic.title },
    });
    if (existingTopic) {
      // Update existing topic
      await prisma.topic.update({
        where: { id: existingTopic.id },
        data: {
          thumbnailUrl: topic.thumbnailUrl,
          categoryTitle: topic.categoryTitle,
          description: topic.description,
          keywords: topic.keywords,
        },
      });
    } else {
      // Create new topic
      await prisma.topic.create({
        data: topic,
      });
    }
  }
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
