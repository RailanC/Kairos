<?php
namespace App\Controller;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class CartController extends AbstractController
{
    #[Route('/cart', name: 'app_cart')]
    public function index(): Response
    {
        $cart = [ 
            ['id' => 1, 'image' => 'card1.png', 'name' => 'Product 1', 'price' => 10.00, 'quantity' => 1],
            ['id' => 2, 'image' => 'card2.png', 'name' => 'Product 2', 'price' => 20.00, 'quantity' => 2],
            ['id' => 3, 'image' => 'card3.png', 'name' => 'Product 3', 'price' => 30.00, 'quantity' => 1],
        ];

        return $this->render('cart/index.html.twig', [
            'controller_name' => 'CartController',
            'cart' => $cart,
        ]);
    }
}