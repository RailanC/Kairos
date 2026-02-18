<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\ProductRepository;

class HomeController extends AbstractController
{
    #[Route('/', name: 'app_root')]
    public function home(): Response
    {
        return $this->redirectToRoute('app_home');
    }

    #[Route('/home', name: 'app_home')]
    public function index(ProductRepository $productRepository): Response
    {
        $products = $productRepository->findAll();
        
        usort($products, function($a, $b) {
            return $b->getAverageRating() <=> $a->getAverageRating();
        });

        $topProducts = array_slice($products, 0, 8);

         return $this->render('home/index.html.twig', [
            'controller_name' => 'HomeController',
            'products' => $topProducts,
        ]);
    }
}
