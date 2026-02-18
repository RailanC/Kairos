<?php

namespace App\Service;

use App\Entity\Cart;
use App\Entity\CartItem;
use App\Entity\Product;
use App\Repository\CartRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\RequestStack;

class CartService
{
    private EntityManagerInterface $entityManager;
    private Security $security;
    private CartRepository $cartRepository;
    private RequestStack $requestStack;

    public function __construct(
        EntityManagerInterface $entityManager,
        Security $security,
        CartRepository $cartRepository,
        RequestStack $requestStack
    ) {
        $this->entityManager = $entityManager;
        $this->security = $security;
        $this->cartRepository = $cartRepository;
        $this->requestStack = $requestStack;
    }

    public function getCurrentCart(): Cart
    {
        $session = $this->requestStack->getSession();
        $user = $this->security->getUser();

        $cartId = $session->get('cart_id');
        if ($cartId) {
            $cart = $this->cartRepository->find($cartId);
            if ($cart) {
                if ($user && $cart->getCustomer() === null) {
                    $cart->setCustomer($user);
                    $this->entityManager->flush();
                    $session->remove('cart_id');
                }
                return $cart;
            }
        }

        if ($user) {
            $cart = $this->cartRepository->findOneBy(['customer' => $user, 'status' => 'active']);
            if ($cart) {
                return $cart;
            }
        }

        $cart = new Cart();
        $cart->setStatus('active');
        $cart->setCreatedAt(new \DateTimeImmutable());
        
        if ($user) {
            $cart->setCustomer($user);
        }

        $this->entityManager->persist($cart);
        $this->entityManager->flush();

        if (!$user) {
            $session->set('cart_id', $cart->getId());
        }

        return $cart;
    }

    public function addItem(Product $product, int $quantity = 1): Cart
    {
        $cart = $this->getCurrentCart();

        foreach ($cart->getCartItems() as $existingItem) {
            if ($existingItem->getProduct()->getId() === $product->getId()) {
                $existingItem->setQuantity($existingItem->getQuantity() + $quantity);
                $this->entityManager->flush();
                return $cart;
            }
        }

        $cartItem = new CartItem();
        $cartItem->setProduct($product);
        $cartItem->setQuantity($quantity);
        $cartItem->setCart($cart);

        $cart->addCartItem($cartItem);
        $this->entityManager->persist($cartItem);
        $this->entityManager->flush(); 

        return $cart;
    }

    public function clearCart(): void
    {
        $user = $this->security->getUser();
        $session = $this->requestStack->getSession();
        if($user){
            $cart = $this->getCurrentCart();
            foreach ($cart->getCartItems() as $cartItem) {
                $this->entityManager->remove($cartItem);
            }
            $this->entityManager->flush();
        }else{
            $session->remove('kairos_cart');
        }
    }
}