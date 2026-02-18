<?php

namespace App\Controller;

use App\Service\CartService;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class CartController extends AbstractController
{
    private EntityManagerInterface $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    #[Route('/cart', name: 'app_cart')]
    public function index(CartService $cartService): Response
    {
        $cart = $cartService->getCurrentCart();
        $cartItems = [];
        
        foreach ($cart->getCartItems() as $item) {
            $product = $item->getProduct();
            $cartItems[] = [
                'id' => $product->getId(),
                'image' => $product->getImage(),
                'name' => $product->getTitle(),
                'price' => $product->getPrice(),
                'quantity' => $item->getQuantity(),
                'total' => $product->getPrice() * $item->getQuantity()
            ];
        }

        return $this->render('cart/index.html.twig', [
            'controller_name' => 'CartController',
            'cart' => $cartItems,
            'cart_total' => array_sum(array_column($cartItems, 'total'))
        ]);
    }

    #[Route('/api/cart', name: 'api_cart_get', methods: ['GET'])]
    public function getCart(CartService $cartService): JsonResponse
    {
        $cart = $cartService->getCurrentCart();
        $cartItems = [];
        
        foreach ($cart->getCartItems() as $item) {
            $product = $item->getProduct();
            $cartItems[] = [
                'id' => $product->getId(),
                'title' => $product->getTitle(),
                'price' => $product->getPrice(),
                'quantity' => $item->getQuantity(),
                'image' => $product->getImage(),
                'total' => $product->getPrice() * $item->getQuantity()
            ];
        }

        return $this->json([
            'items' => $cartItems,
            'total' => array_sum(array_column($cartItems, 'total')),
            'count' => count($cartItems)
        ]);
    }

    #[Route('/api/cart/sync', name: 'api_cart_sync', methods: ['POST'])]
    public function syncCart(
        Request $request, 
        CartService $cartService,
        ProductRepository $productRepository
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        error_log("=== Cart Sync Started ===");
        error_log("Raw data: " . print_r($data, true));

        if (!isset($data['items']) || !is_array($data['items'])) {
            error_log("Invalid data received");
            return $this->json(['error' => 'Invalid data'], 400);
        }

        $cart = $cartService->getCurrentCart();
        error_log("Cart ID: " . $cart->getId());

        foreach ($data['items'] as $itemData) {
            $productId = $itemData['id'] ?? null;
            $quantity = $itemData['quantity'] ?? 1;

            error_log("Processing item: ID=$productId, Qty=$quantity");

            if (!$productId) {
                error_log("Skipping item with no ID");
                continue;
            }

            $product = $productRepository->find($productId);
            if (!$product) {
                error_log("Product ID $productId not found in DB!");
                continue;
            }

            if ($quantity <= 0) {
                error_log("Removing item ID $productId");
                foreach ($cart->getCartItems() as $cartItem) {
                    if ($cartItem->getProduct()->getId() === (int)$productId) {
                        $this->em->remove($cartItem);
                        break;
                    }
                }
            } else {
                $existingItem = null;
                foreach ($cart->getCartItems() as $cartItem) {
                    if ($cartItem->getProduct()->getId() === (int)$productId) {
                        $existingItem = $cartItem;
                        break;
                    }
                }

                if ($existingItem) {
                    error_log("Updating item ID $productId to quantity $quantity");
                    $existingItem->setQuantity($quantity);
                } else {
                    error_log("Adding new item ID $productId with quantity $quantity");
                    $cartService->addItem($product, $quantity);
                }
            }
        }

        $this->em->flush();
        error_log("=== Cart Sync Finished ===");
        return $this->json(['status' => 'ok']);
    }
}