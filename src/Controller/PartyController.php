<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class PartyController extends AbstractController
{
    #[Route('/party', name: 'app_party')]
    public function index(): Response
    {
        return $this->render('party/index.html.twig', [
            'controller_name' => 'PartyController',
        ]);
    }
}
