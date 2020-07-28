<?php

namespace App\Command;

use App\Entity\Idea;
use Doctrine\ORM\EntityManagerInterface;
use Faker\Factory;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class AddIdeasCommand extends Command
{
    public static $defaultName = 'app:add-ideas';

    /**
     * @var EntityManagerInterface
     */
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        parent::__construct();

        $this->entityManager = $entityManager;
    }

    public function configure()
    {
        $this->addArgument('number', InputArgument::REQUIRED, "The number of ideas to add");
    }

    protected function execute(
        InputInterface $input,
        OutputInterface $output
    ) {
        $numberOfIdeas = $input->getArgument('number');

        // Se connecter a la base de donnees getdoctrine / entity manager

        // gnere les idees
        $faker = Factory::create('fr');
        $data = [];
        for ($i = 0; $i < $numberOfIdeas; $i++) {
            $idea = new Idea();

            $idea->setTitle($faker->realText());
            $output->writeln("New idea: {$idea->getTitle()}");
            $idea->setCreatedAt($faker->dateTimeBetween($startDate = '-6 months', $endDate = 'now', $timezone = null));
            $idea->setAuthor($faker->name());
            $idea->setScore($faker->numberBetween(0, 50));
            $this->entityManager->persist($idea);
        }

        // persist et flush
        $this->entityManager->flush();

        // success my friend
        $output->writeln("Everyting OK ! $numberOfIdeas generated.");
        $output->writeln('');

        return 0;
    }
}
