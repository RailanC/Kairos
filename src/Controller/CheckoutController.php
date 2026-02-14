<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class CheckoutController extends AbstractController
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
            'stripe_public_key' => $this->getParameter('stripe_public_key'),
            'countries' => $contries
        ]);
        
    }

    #[Route('/checkout/success', name: 'payment_success')]
    public function success(): Response
    {
        return $this->render('checkout/success.html.twig');
    }

    #[Route('/create-payment-intent', name: 'create_payment_intent', methods: ['POST'])]
    public function createPaymentIntent(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $amount = $data['amount'] ?? 0;

        if ($amount <= 0) {
            return $this->json(['error' => 'Invalid amount'], 400);
        }

        \Stripe\Stripe::setApiKey($this->getParameter('stripe_secret_key'));

        try {
            $paymentIntent = \Stripe\PaymentIntent::create([
                'amount' => $amount,
                'currency' => 'eur',
                'automatic_payment_methods' => ['enabled' => true],
            ]);
            
            return $this->json([
                'clientSecret' => $paymentIntent->client_secret
            ]);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }
}