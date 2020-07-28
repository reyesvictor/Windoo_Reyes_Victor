<?php

namespace App\Controller;

use App\Entity\Idea;
use App\Repository\IdeaRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class IdeasController
{
    /**
     * Get list of ideas from Faker
     *
     * @Route("/api/ideas", name="ideas_get")
     *
     * @return Response
     */
    public function getIdeas(IdeaRepository $ideaRepository): Response
    {
        $ideas = $ideaRepository->findAll();

        return new JsonResponse($ideas);
    }

    /**
     * @Route("/api/ideas/{id}/vote", name="ideas_upvote", methods={"POST"})
     */
    public function voteIdea(EntityManagerInterface $entityManager, Idea $idea, Request $request): Response
    {
        $score = $idea->getScore();
        $idea->setScore($score + $request->get('vote'));

        $entityManager->flush();

        return new JsonResponse($request->query->all());
    }
}
