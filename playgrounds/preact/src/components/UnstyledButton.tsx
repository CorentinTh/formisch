import { useSignal } from '@preact/signals';
import clsx from 'clsx';
import { ComponentChildren } from 'preact';
import { Spinner } from './Spinner';

type LinkProps = {
  type: 'link';
  href: string;
  download?: boolean | string;
  target?: '_blank';
};

type ButtonProps = {
  type: 'button' | 'reset' | 'submit';
  onClick?: () => unknown;
  loading?: boolean;
  form?: string;
};

export type DefaultButtonProps = LinkProps | ButtonProps;

type UnstyledButtonProps = DefaultButtonProps & {
  class?: string;
  'aria-label'?: string;
  children: ComponentChildren;
};

/**
 * Basic button component that contains important functionality and is used to
 * build more complex components on top of it.
 */
export function UnstyledButton(props: UnstyledButtonProps) {
  // Use loading signal
  const loading = useSignal(false);

  // Return link button
  if (props.type === 'link') {
    return (
      <a {...props} rel={props.target === '_blank' ? 'noreferrer' : undefined}>
        {props.children}
      </a>
    );
  }

  return (
    <button
      {...props}
      disabled={loading.value || props.loading}
      // Start and stop loading if function is async
      onClick={
        props.onClick &&
        (async () => {
          loading.value = true;
          await props.onClick!();
          loading.value = false;
        })
      }
    >
      <span
        class={clsx(
          'transition-[opacity,transform,visibility] duration-200',
          loading.value || props.loading
            ? 'invisible translate-x-5 opacity-0'
            : 'visible delay-300'
        )}
      >
        {props.children}
      </span>
      <span
        class={clsx(
          'absolute duration-200',
          loading.value || props.loading
            ? 'visible delay-300'
            : 'invisible -translate-x-5 opacity-0'
        )}
      >
        <Spinner />
      </span>
    </button>
  );
}
