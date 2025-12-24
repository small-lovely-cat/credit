/*
Copyright 2025 linux.do

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

package oauth

import (
	"context"
	"sync"

	"github.com/coreos/go-oidc/v3/oidc"
	"github.com/linux-do/credit/internal/config"
	"github.com/linux-do/credit/internal/logger"
	"golang.org/x/oauth2"
)

var (
	oauthConf    *oauth2.Config
	oidcProvider *oidc.Provider
	oidcVerifier *oidc.IDTokenVerifier
	initOnce     sync.Once
	initErr      error
)

// InitOIDC 初始化 OIDC Provider 和 Verifier
func InitOIDC(ctx context.Context) error {
	initOnce.Do(func() {
		issuer := config.Config.OAuth2.Issuer
		if issuer == "" {
			issuer = "https://connect.linux.do/"
		}

		// 创建 OIDC Provider
		oidcProvider, initErr = oidc.NewProvider(ctx, issuer)
		if initErr != nil {
			logger.ErrorF(ctx, "Failed to create OIDC provider: %v", initErr)
			return
		}

		// 创建 ID Token 验证器
		oidcVerifier = oidcProvider.Verifier(&oidc.Config{
			ClientID: config.Config.OAuth2.ClientID,
		})

		// 使用 OIDC Provider 的端点配置 OAuth2
		oauthConf = &oauth2.Config{
			ClientID:     config.Config.OAuth2.ClientID,
			ClientSecret: config.Config.OAuth2.ClientSecret,
			RedirectURL:  config.Config.OAuth2.RedirectURI,
			Scopes:       []string{oidc.ScopeOpenID, "profile", "email"},
			Endpoint:     oidcProvider.Endpoint(),
		}

		logger.InfoF(ctx, "OIDC provider initialized successfully with issuer: %s", issuer)
	})

	return initErr
}

// GetOIDCVerifier 获取 OIDC ID Token 验证器
func GetOIDCVerifier() *oidc.IDTokenVerifier {
	return oidcVerifier
}

// GetOIDCProvider 获取 OIDC Provider
func GetOIDCProvider() *oidc.Provider {
	return oidcProvider
}

// GetOAuthConfig 获取 OAuth2 配置
func GetOAuthConfig() *oauth2.Config {
	return oauthConf
}

// InitOAuthFallback 初始化 OAuth2 (不使用 OIDC，作为回退方案)
func InitOAuthFallback() {
	oauthConf = &oauth2.Config{
		ClientID:     config.Config.OAuth2.ClientID,
		ClientSecret: config.Config.OAuth2.ClientSecret,
		RedirectURL:  config.Config.OAuth2.RedirectURI,
		Scopes:       []string{oidc.ScopeOpenID, "profile", "email"},
		Endpoint: oauth2.Endpoint{
			AuthURL:   config.Config.OAuth2.AuthorizationEndpoint,
			TokenURL:  config.Config.OAuth2.TokenEndpoint,
			AuthStyle: oauth2.AuthStyleAutoDetect,
		},
	}
}
