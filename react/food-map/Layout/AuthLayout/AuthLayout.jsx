/** @jsxImportSource @emotion/react */
import * as s from './style.js';

function AuthLayout({children}) {
    return (
        <div css={s.layout}>
            <div css={s.container}>
                <h1 css={s.title}>Food-Map</h1>
                {children}
            </div>
        </div>
    )
}
export default AuthLayout;