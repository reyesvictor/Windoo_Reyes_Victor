<?php

namespace App\Controller;

use Faker\Factory;
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
    public function get_ideas(): Response
    {
        $faker = Factory::create('FR-fr');
        $data = [];
        for ($i = 1; $i <= $faker->numberBetween($min = 10, $max = 50); $i++) {
            $idea = [];
            $idea["id"] = $i;
            $idea["title"] = $faker->sentence();
            $idea["createdAt"] = $faker->dateTimeBetween($startDate = '-6 months', $endDate = 'now', $timezone = null);
            $idea["date_number"] = $idea["createdAt"]->getTimestamp();
            $idea["author"] = $faker->name();
            $idea["score"] = $faker->numberBetween($min = 0, $max = 50);

            array_push($data, $idea);
        }
        return new Response(json_encode($data));
    }
}
