<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ProductController extends AbstractController
{
    #[Route('/produits', name: 'app_product')]
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
        return $this->render('product/index.html.twig', [
            'controller_name' => 'ProductController',
            'cards' => $cards,
        ]);
    }
}
