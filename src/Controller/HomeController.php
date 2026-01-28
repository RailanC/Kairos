<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class HomeController extends AbstractController
{
    #[Route('/home', name: 'app_home')]
    public function index(): Response
    {
        $cards = [
            ['image' => 'card1.png', 'star' => '1'],
            ['image' => 'card2.png', 'star' => '2'],
            ['image' => 'card3.png', 'star' => '3'],
            ['image' => 'card1.png', 'star' => '4'],
            ['image' => 'card2.png', 'star' => '5'],
            ['image' => 'card3.png', 'star' => '4'],
            ['image' => 'card2.png', 'star' => '2'],
            ['image' => 'card3.png', 'star' => '3'],
            
        ];
        return $this->render('home/index.html.twig', [
            'controller_name' => 'HomeController',
            'cards' => $cards,
        ]);
    }
}
