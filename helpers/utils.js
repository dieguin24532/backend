const buscarMetaKey = (array, meta_key) => {
          return array
            .find((item) => item.get("meta_key") === meta_key)
            ?.get("meta_value") || null;
}

export { buscarMetaKey }