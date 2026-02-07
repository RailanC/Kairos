<?php

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\IsTrue;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;

class RegistrationFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('firstname', Type\TextType::class, [
                'attr' => ['class' => 'form-control border-0'],
            ])
            ->add('lastname', Type\TextType::class, [
                'attr' => ['class' => 'form-control border-0'],

            ])
            ->add('email', Type\EmailType::class, [
                'attr' => ['class' => 'form-control d-none user-email-input border-0', 'readonly' => true],
                'label_attr' => ['class' => 'd-none']
            ])
            ->add('agreeTerms', Type\CheckboxType::class, [
                'mapped' => false,
                'constraints' => [
                    new IsTrue([
                        'message' => 'You should agree to our terms.',
                    ]),
                ],
                'attr' => ['class' => 'form-check-input border-0'],
            ])
            ->add('plainPassword', Type\RepeatedType::class, [
                'type' => Type\PasswordType::class,
                // instead of being set onto the object directly,
                // this is read and encoded in the controller
                'mapped' => false,
                'first_options'  => [
                    'label' => 'Password',
                    'attr' => ['autocomplete' => 'new-password',
                    'class' => 'form-control border-0'],
                ],
                'second_options' => [
                    'label' => 'Confirm Password',
                    'attr' => ['autocomplete' => 'new-password',
                    'class' => 'form-control border-0'],
                    ],
                'invalid_message' => 'The password fields must match.',
                'constraints' => [
                    new NotBlank([
                        'message' => 'Please enter a password',
                    ]),
                    new Length([
                        'min' => 6,
                        'minMessage' => 'Your password should be at least {{ limit }} characters',
                        // max length allowed by Symfony for security reasons
                        'max' => 4096,
                    ]),
                ],
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => User::class,
        ]);
    }
}
