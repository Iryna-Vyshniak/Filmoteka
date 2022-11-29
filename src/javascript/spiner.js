export function spinnerPlay() {
    document.querySelector('body').classList.add('loading');
}

export function spinnerStop() {
    document.querySelector('body').classList.remove('loading');
}
