<?php
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

        $existingCart = $this->cartRepository->findOneBy(['customer' => $user, 'status' => 'active']);

        if ($existingCart && $existingCart !== $sessionCart) {
        } else {
            $sessionCart->setCustomer($user);
            $this->em->flush();
        }

        $session->remove('cart_id');
    }
}