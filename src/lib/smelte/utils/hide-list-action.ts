export function hideListAction(node: any, cb: () => void): unknown {
  const onWindowClick = (e) => {
    if (!node.contains(e.target)) {
      cb();
    }
  };

  window.addEventListener('click', onWindowClick);

  return {
    destroy: () => {
      window.removeEventListener('click', onWindowClick);
    },
  };
}
