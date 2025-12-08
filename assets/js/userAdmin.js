async function deleteUser(userId) {
    if (!confirm('Er du sikker på, at du vil slette denne bruger?')) return

    const response = await fetch('/users/' + userId, { method: 'DELETE' })

    if (response.status === 204)
        window.location.reload()
    else if (response.status === 403)
        alert('Adgang nægtet. Kun administratorer (Niveau 3) kan slette brugere.')
    else if (response.status === 404)
        alert('Brugeren blev ikke fundet.')
    else
        alert('Der skete en fejl under sletning af brugeren.')
}