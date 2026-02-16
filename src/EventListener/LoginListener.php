<?php
// src/EventListener/LoginListener.php
namespace App\EventListener;

use App\Repository\CartRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Http\Event\InteractiveLoginEvent;
use Symfony\Component\HttpFoundation\RequestStack;

class LoginListener
{
    public function __construct(
        private RequestStack $requestStack,
        private EntityManagerInterface $em,
        private CartRepository $cartRepository
    ) {}

    public function onSecurityInteractiveLogin(InteractiveLoginEvent $event): void
    {
        $user = $event->getAuthenticationToken()->getUser();
        $session = $this->requestStack->getSession();
        $cartId = $session->get('cart_id');

        if (!$cartId) {
            return;
        }

        $sessionCart = $this->cartRepository->find($cartId);
        if (!$sessionCart) {
            return;
        }

        // Check if the user already has an active cart in the DB
        $existingCart = $this->cartRepository->findOneBy(['customer' => $user, 'status' => 'active']);

        if ($existingCart && $existingCart !== $sessionCart) {
            // OPTIONAL: Logic to merge $sessionCart items into $existingCart
            // For now, we just link the session cart to the user if they don't have one
            // Or you can delete the old one. 
        } else {
            $sessionCart->setCustomer($user);
            $this->em->flush();
        }

        // Clean up session
        $session->remove('cart_id');
    }
}