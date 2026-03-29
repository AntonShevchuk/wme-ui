let unsafePolicy: any = { createHTML: (string: string) => string }

if ((window as any).trustedTypes && (window as any).trustedTypes.createPolicy) {
  unsafePolicy = (window as any).trustedTypes.createPolicy('unsafe', {
    createHTML: (string: string) => string,
  })
}

export { unsafePolicy }
