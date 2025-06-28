import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/vpn_provider.dart';
import '../../providers/server_provider.dart';
import '../../providers/auth_provider.dart';
import '../../widgets/connection_button.dart';
import '../../widgets/server_card.dart';
import '../../widgets/stats_card.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Consumer<AuthProvider>(
                builder: (context, authProvider, child) {
                  final user = authProvider.user;
                  return Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Welcome back,',
                            style: theme.textTheme.bodyLarge?.copyWith(
                              color: Colors.grey[600],
                            ),
                          ),
                          Text(
                            user?.name ?? 'User',
                            style: theme.textTheme.headlineSmall?.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: user?.isPremiumActive == true
                              ? Colors.orange.withOpacity(0.1)
                              : theme.primaryColor.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          user?.isPremiumActive == true ? 'PREMIUM' : 'FREE',
                          style: TextStyle(
                            color: user?.isPremiumActive == true
                                ? Colors.orange
                                : theme.primaryColor,
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                          ),
                        ),
                      ),
                    ],
                  );
                },
              ),
              
              const SizedBox(height: 30),
              
              // Connection Status
              Consumer<VpnProvider>(
                builder: (context, vpnProvider, child) {
                  return Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: vpnProvider.isConnected
                            ? [
                                const Color(0xFF4CAF50),
                                const Color(0xFF45A049),
                              ]
                            : [
                                Colors.grey[300]!,
                                Colors.grey[400]!,
                              ],
                      ),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Column(
                      children: [
                        Icon(
                          vpnProvider.isConnected
                              ? Icons.shield
                              : Icons.shield_outlined,
                          size: 60,
                          color: vpnProvider.isConnected
                              ? Colors.white
                              : Colors.grey[600],
                        ),
                        const SizedBox(height: 12),
                        Text(
                          vpnProvider.isConnected ? 'PROTECTED' : 'NOT PROTECTED',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: vpnProvider.isConnected
                                ? Colors.white
                                : Colors.grey[600],
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          vpnProvider.isConnected
                              ? 'Your connection is secure'
                              : 'Tap to connect to VPN',
                          style: TextStyle(
                            fontSize: 14,
                            color: vpnProvider.isConnected
                                ? Colors.white70
                                : Colors.grey[500],
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
              
              const SizedBox(height: 30),
              
              // Connection Button
              const ConnectionButton(),
              
              const SizedBox(height: 30),
              
              // Selected Server
              Consumer<ServerProvider>(
                builder: (context, serverProvider, child) {
                  final selectedServer = serverProvider.selectedServer;
                  if (selectedServer == null) {
                    return const SizedBox.shrink();
                  }
                  
                  return Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Selected Server',
                        style: theme.textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 12),
                      ServerCard(
                        server: selectedServer,
                        isSelected: true,
                        onTap: () {
                          // Navigate to servers screen
                        },
                      ),
                    ],
                  );
                },
              ),
              
              const SizedBox(height: 30),
              
              // Connection Stats
              Consumer<VpnProvider>(
                builder: (context, vpnProvider, child) {
                  if (!vpnProvider.isConnected) {
                    return const SizedBox.shrink();
                  }
                  
                  return Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Connection Stats',
                        style: theme.textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Expanded(
                            child: StatsCard(
                              title: 'Download',
                              value: vpnProvider.formatSpeed(vpnProvider.downloadSpeed),
                              icon: Icons.download,
                              color: Colors.green,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: StatsCard(
                              title: 'Upload',
                              value: vpnProvider.formatSpeed(vpnProvider.uploadSpeed),
                              icon: Icons.upload,
                              color: Colors.blue,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Expanded(
                            child: StatsCard(
                              title: 'Total Down',
                              value: vpnProvider.formatBytes(vpnProvider.totalDownload),
                              icon: Icons.arrow_downward,
                              color: Colors.orange,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: StatsCard(
                              title: 'Total Up',
                              value: vpnProvider.formatBytes(vpnProvider.totalUpload),
                              icon: Icons.arrow_upward,
                              color: Colors.purple,
                            ),
                          ),
                        ],
                      ),
                    ],
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}