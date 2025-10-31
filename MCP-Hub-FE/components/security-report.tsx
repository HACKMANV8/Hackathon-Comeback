"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Bug, CheckCircle, Shield, XCircle } from "lucide-react";

interface SecurityReportProps {
  security?: {
    summary: {
      total_issues: number;
      bugs: number;
      vulnerabilities: number;
      code_smells: number;
      security_hotspots: number;
    };
    metrics: {
      reliability_rating: string;
      security_rating: string;
      sqale_rating: string;
      complexity: string;
      coverage: string;
    };
    issues: {
      by_severity: {
        critical: number;
        major: number;
        minor: number;
      };
      details: {
        CRITICAL: Array<{
          message: string;
          file: string;
          line: number;
          rule: string;
        }>;
        MAJOR: Array<{
          message: string;
          file: string;
          line: number;
          rule: string;
        }>;
      };
    };
    security_hotspots: Array<{
      message: string;
      file: string;
      line: number;
      category: string;
      status: string;
    }>;
  };
}

export default function SecurityReport({ security }: SecurityReportProps) {
  if (!security) {
    return (
      <div className="text-center py-12">
        <Shield className="w-12 h-12 text-gray-500/50 mx-auto mb-4" />
        <p className="text-gray-400/70">No security report available</p>
      </div>
    );
  }

  const getRatingColor = (rating: string) => {
    const numRating = parseFloat(rating);
    if (numRating >= 4.0) return "text-red-400";
    if (numRating >= 2.0) return "text-orange-400";
    return "text-green-400";
  };

  const getRatingLabel = (rating: string) => {
    const numRating = parseFloat(rating);
    if (numRating >= 4.0) return "Poor";
    if (numRating >= 2.0) return "Fair";
    return "Good";
  };

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-3 gap-4"
      >
        {/* Vulnerabilities */}
        <div className="border border-white/10 rounded-xl bg-white/[0.02] p-5">
          <div className="flex items-center gap-3 mb-3">
            {security.summary.vulnerabilities === 0 ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400" />
            )}
            <span className="text-xs text-gray-400/70 uppercase tracking-wider">
              Vulnerabilities
            </span>
          </div>
          <div className="text-3xl font-bold text-white/95">
            {security.summary.vulnerabilities}
          </div>
        </div>

        {/* Bugs */}
        <div className="border border-white/10 rounded-xl bg-white/[0.02] p-5">
          <div className="flex items-center gap-3 mb-3">
            {security.summary.bugs === 0 ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <Bug className="w-5 h-5 text-orange-400" />
            )}
            <span className="text-xs text-gray-400/70 uppercase tracking-wider">
              Bugs
            </span>
          </div>
          <div className="text-3xl font-bold text-white/95">
            {security.summary.bugs}
          </div>
        </div>

        {/* Security Hotspots */}
        <div className="border border-white/10 rounded-xl bg-white/[0.02] p-5">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <span className="text-xs text-gray-400/70 uppercase tracking-wider">
              Security Hotspots
            </span>
          </div>
          <div className="text-3xl font-bold text-white/95">
            {security.summary.security_hotspots}
          </div>
        </div>
      </motion.div>

      {/* Ratings */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="border border-white/10 rounded-xl bg-white/[0.02] p-6"
      >
        <h3 className="text-lg font-semibold text-white/95 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyan-400" />
          Quality Ratings
        </h3>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-gray-400/70 mb-2 uppercase tracking-wider">
              Security
            </p>
            <div className="flex items-center gap-2">
              <span
                className={`text-2xl font-bold ${getRatingColor(security.metrics.security_rating)}`}
              >
                {security.metrics.security_rating}
              </span>
              <span className="text-sm text-gray-400/80">
                {getRatingLabel(security.metrics.security_rating)}
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400/70 mb-2 uppercase tracking-wider">
              Reliability
            </p>
            <div className="flex items-center gap-2">
              <span
                className={`text-2xl font-bold ${getRatingColor(security.metrics.reliability_rating)}`}
              >
                {security.metrics.reliability_rating}
              </span>
              <span className="text-sm text-gray-400/80">
                {getRatingLabel(security.metrics.reliability_rating)}
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400/70 mb-2 uppercase tracking-wider">
              Maintainability
            </p>
            <div className="flex items-center gap-2">
              <span
                className={`text-2xl font-bold ${getRatingColor(security.metrics.sqale_rating)}`}
              >
                {security.metrics.sqale_rating}
              </span>
              <span className="text-sm text-gray-400/80">
                {getRatingLabel(security.metrics.sqale_rating)}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Critical Issues */}
      {security.issues.details.CRITICAL.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="border border-white/10 rounded-xl bg-white/[0.02] p-6"
        >
          <h3 className="text-lg font-semibold text-white/95 mb-4 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" />
            Critical Issues ({security.issues.details.CRITICAL.length})
          </h3>
          <div className="space-y-3">
            {security.issues.details.CRITICAL.slice(0, 3).map((issue, idx) => (
              <div
                key={idx}
                className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg"
              >
                <p className="text-sm text-gray-300/90 mb-2">{issue.message}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    📄 {issue.file}
                  </span>
                  <span>Line {issue.line}</span>
                  <code className="px-2 py-0.5 bg-white/5 rounded text-gray-400">
                    {issue.rule}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Security Hotspots */}
      {security.security_hotspots.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="border border-white/10 rounded-xl bg-white/[0.02] p-6"
        >
          <h3 className="text-lg font-semibold text-white/95 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            Security Hotspots ({security.security_hotspots.length})
          </h3>
          <div className="space-y-3">
            {security.security_hotspots.map((hotspot, idx) => (
              <div
                key={idx}
                className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm text-gray-300/90 flex-1">
                    {hotspot.message}
                  </p>
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                    {hotspot.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    📄 {hotspot.file}
                  </span>
                  <span>Line {hotspot.line}</span>
                  <span className="px-2 py-0.5 bg-white/5 rounded text-gray-400">
                    {hotspot.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Issue Summary */}
      {security.issues.by_severity.major > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="border border-white/10 rounded-xl bg-white/[0.02] p-6"
        >
          <h3 className="text-lg font-semibold text-white/95 mb-4">
            Issue Distribution
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400 mb-1">
                {security.issues.by_severity.critical}
              </div>
              <p className="text-xs text-gray-400/70 uppercase tracking-wider">
                Critical
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400 mb-1">
                {security.issues.by_severity.major}
              </div>
              <p className="text-xs text-gray-400/70 uppercase tracking-wider">
                Major
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {security.issues.by_severity.minor}
              </div>
              <p className="text-xs text-gray-400/70 uppercase tracking-wider">
                Minor
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
