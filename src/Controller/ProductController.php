<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\ProductRepository;
class ProductController extends AbstractController
{
    #[Route('/products', name: 'app_product')]
    public function index(ProductRepository $productRepository): Response
    {
         $products = $productRepository->findAll();
        return $this->render('product/index.html.twig', [
            'controller_name' => 'ProductController',
            'products' => $products,
        ]);
    }

    #[Route('/product/{id}/add-to-cart', name: 'app_add_to_cart')]
    public function addToCart(int $id, CartService $cartService, ProductRepository $productRepo): Response
    {
        $product = $productRepo->find($id);
        if (!$product) {
            throw $this->createNotFoundException('Product not found');
        }

        $cartService->addItem($product, 1);

        return $this->redirectToRoute('app_cart_show');
    }
}
