<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class CheckourController extends AbstractController
{
    #[Route('/checkout', name: 'app_checkout')]
    public function index(): Response
    {
        $contries = [
            'FR' => 'France',
            'US' => 'United States',
            'CA' => 'Canada',
            'GB' => 'United Kingdom',
            'AU' => 'Australia',
            'DE' => 'Germany',
            'IT' => 'Italy',
            'BR' => 'Brazil',
            'PT' => 'Portugal',
        ];
        return $this->render('checkout/index.html.twig', [
            'controller_name' => 'CheckourController',
            'countries' => $contries,
        ]);
    }
}